import { useContext, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleDoubleRight,
  faAngleDoubleLeft
} from '@fortawesome/free-solid-svg-icons'
import InputMask from 'react-input-mask'
import { useDebouncedCallback } from 'use-debounce'
import * as Styles from 'components/Login/styles'
import { useRouter } from 'next/dist/client/router'
import { UserContext } from 'contexts/userContext'
import { GlobalContext } from 'contexts/globalContext'
import { isValidCPF } from 'utils'
import jwt from 'jsonwebtoken'

const LoginUser = () => {
  const [fieldCPF, setFieldCPF] = useState('')
  const [fieldCodeOrder, setFieldCodeOrder] = useState('')
  const [fieldCPFError, setFieldCPFError] = useState('')
  const [fieldCodeOrderError, setFieldCodeOrderError] = useState('')
  const UserCtx = useContext(UserContext)
  const userInfoJWT = jwt.decode(UserCtx.userLogged)
  const GlobalCtx = useContext(GlobalContext)
  const router = useRouter()

  const changeFieldCPF = useDebouncedCallback((e) => {
    setFieldCPF(e.target.value)
    fieldCPFError !== '' && setFieldCPFError('')
  }, 200)

  const changeFieldCodeOrder = useDebouncedCallback((e) => {
    setFieldCodeOrder(e.target.value)
    fieldCodeOrderError !== '' && setFieldCodeOrderError('')
  }, 200)

  const returnHomeInitial = () => {
    GlobalCtx.changeProfile('initial')
  }

  const redirectLogin = async (idUser) => {
    //AQUI chamar a função para cadastrar na API da TEIA com o id do pedido da tray
    const res = await UserCtx.setUserInfo(idUser)
    //Tambem adicionar o ID do usuário e o CEP dele
    res === 'complete' && router.push(`/mapa-de-agendamentos/${fieldCodeOrder}`)
  }

  const searchUserSendRedirect = () => {
    fetch(`https://api.fbits.net/pedidos/${fieldCodeOrder}`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${process.env.TRAY_TOKEN}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        let cpfFormated = fieldCPF.replace(/[\s.-]*/gim, '')

        if (data.usuario.cpf === cpfFormated) {
          redirectLogin(data.usuario.usuarioId)
        } else {
          GlobalCtx.setInformationsModal({
            title: 'CPF NÃO CORRESPONDENTE',
            body: '<p>Este pedido não está atrelado ao mesmo CPF.</p>',
            type: 'warning'
          })

          GlobalCtx.toggleModalContainer('alert')
        }
      })
      .catch((error) => {
        console.log(error)
        GlobalCtx.setInformationsModal({
          title: 'CÓDIGO INVÁLIDO',
          body: '<p>Por favor revise o Código do Pedido.</p>',
          type: 'warning'
        })
        GlobalCtx.toggleModalContainer('alert')
      })
  }

  const validateFields = () => {
    if (!isValidCPF(fieldCPF) || fieldCodeOrder === '' || fieldCodeOrder <= 0) {
      !isValidCPF(fieldCPF) && setFieldCPFError('CPF inválido.')
      fieldCPF === '' && setFieldCPFError('Campo obrigatório.')
      fieldCodeOrder <= 0 && setFieldCodeOrderError('Código inválido.')
      fieldCodeOrder === '' && setFieldCodeOrderError('Campo obrigatório.')
      return null
    }
    searchUserSendRedirect()
  }

  const sendInformations = (e) => {
    const key = e.keyCode

    if (key === 13) validateFields()
  }

  const validateJWT = () => {
    return userInfoJWT !== null &&
      userInfoJWT.idUser !== 0 &&
      !isNaN(userInfoJWT.idUser)
      ? true
      : false
  }

  return (
    <Styles.LoginWrapper>
      <Styles.LoginContent>
        <Styles.LoginForm
          action="#"
          onKeyUp={(e) => {
            sendInformations(e)
          }}
        >
          <Styles.FormHeader>
            <Styles.FormHeaderTitle>
              {validateJWT()
                ? 'Consultar Pedido para Instalação'
                : 'Realizar Login e Consultar Pedido para Instalação'}
            </Styles.FormHeaderTitle>
          </Styles.FormHeader>
          <Styles.FormContent>
            <Styles.FormContentTitle>
              Para concluir indique seu código do pedido e CPF
            </Styles.FormContentTitle>

            <Styles.FieldWrapper>
              <Styles.FormWrapperLabel htmlFor="code__order">
                Código do Pedido
              </Styles.FormWrapperLabel>
              <Styles.FormWrapperInput
                type="text"
                id="code__order"
                onChange={(e) => changeFieldCodeOrder(e)}
              />
              <Styles.FormWrapperNotice className="code__order">
                {fieldCodeOrderError}
              </Styles.FormWrapperNotice>
            </Styles.FieldWrapper>

            <Styles.FieldWrapper>
              <Styles.FormWrapperLabel htmlFor="txt__cpf">
                CPF
              </Styles.FormWrapperLabel>

              <InputMask
                mask="999.999.999-99"
                onChange={(e) => changeFieldCPF(e)}
              >
                {(inputProps) => (
                  <Styles.FormWrapperInput
                    type="text"
                    id="txt__cpf"
                    {...inputProps}
                  />
                )}
              </InputMask>
              <Styles.FormWrapperNotice className="txt__cpf">
                {fieldCPFError}
              </Styles.FormWrapperNotice>
            </Styles.FieldWrapper>
            <Styles.FormFooter>
              {!validateJWT() && (
                <Styles.FormButtonBack
                  type="button"
                  onClick={() => returnHomeInitial()}
                >
                  <FontAwesomeIcon icon={faAngleDoubleLeft} size="lg" />
                  Voltar
                </Styles.FormButtonBack>
              )}
              <Styles.FormButtonContinue
                type="button"
                onClick={() => validateFields()}
              >
                Continuar
                <FontAwesomeIcon icon={faAngleDoubleRight} size="lg" />
              </Styles.FormButtonContinue>
            </Styles.FormFooter>
          </Styles.FormContent>
        </Styles.LoginForm>
      </Styles.LoginContent>
    </Styles.LoginWrapper>
  )
}

export default LoginUser
