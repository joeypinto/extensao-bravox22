import { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { GlobalContext } from 'contexts/globalContext'
import { SchedulingContext } from 'contexts/schedulingContext'
import ModalContainer from 'containers/ModalContainer'
import * as Styles from './styles'
import { PERIODS } from 'constants/globals'

const ModalModifyOrder = () => {
  const [dateSelected, setDateSelected] = useState('')
  const ctxGlobal = useContext(GlobalContext)
  const ctxScheduling = useContext(SchedulingContext)

  useEffect(() => {
    setDateSelected(ctxScheduling.orderSelected.dateCurrencyOrder)
    ctxScheduling.setPeriodSelected(ctxScheduling.orderSelected.period)
    return () => {
      setDateSelected('')
      ctxScheduling.setPeriodSelected('')
    }
  }, [])

  const closeModal = () => {
    ctxGlobal.toggleModalContainer('init')
    ctxScheduling.saveInfoOrderModify(0, 0, '', true)
  }

  const filterDataOnlyPeriod = () => {
    const onlyPeriods = []

    ctxScheduling.daysOfTechnical.forEach((day) => {
      if (day.amount > 0 && onlyPeriods.indexOf(day.period) === -1) {
        onlyPeriods.push(day.period)
      }
    })

    return onlyPeriods
  }

  const listDataAvaliable = (arraySelected) => {
    return arraySelected.filter((days) => {
      return days.period === ctxScheduling.periodSelected
    })
  }

  const formatedDate = (date) => {
    const dataFormated = new Date(date.replace(/-/gi, '/'))

    return `${dataFormated.getDate()}/${
      dataFormated.getMonth() + 1
    }/${dataFormated.getFullYear()}`
  }

  const saveModify = () => {
    //Aqui será salvo as datas e periodo
    //Aqui tbm onde será enviado uma mensagem em Whatss e email
    // antes validar se tem data e periodo selecionado
  }

  return (
    <ModalContainer isOpen={ctxGlobal.isToggleModal === 'modifyOrder' && true}>
      <Styles.ModalModifyOrderWrapper>
        <Styles.ModalHeader>
          <Styles.HeaderTitle>Alterar</Styles.HeaderTitle>
          <Styles.ButtonClose
            type="button"
            onClick={() => closeModal()}
            aria-labelledby="Ícone em xis para fechar"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </Styles.ButtonClose>
        </Styles.ModalHeader>
        <Styles.FormModifyOrder action="#">
          {filterDataOnlyPeriod().length > 0 && (
            <Styles.FormContent>
              <Styles.FormLabel>Período</Styles.FormLabel>
              <Styles.FormSelect
                value={ctxScheduling.periodSelected}
                defaultValue={ctxScheduling.periodSelected}
                onChange={(e) => {
                  ctxScheduling.setPeriodSelected(e.target.value)
                  setDateSelected('')
                }}
              >
                {filterDataOnlyPeriod().map((period, index) => {
                  return (
                    <option key={`periodTechnical${index}`} value={period}>
                      {PERIODS[period].label}
                    </option>
                  )
                })}
              </Styles.FormSelect>
            </Styles.FormContent>
          )}
          {filterDataOnlyPeriod().length > 0 &&
            listDataAvaliable(ctxScheduling.daysOfTechnical).length > 0 && (
              <Styles.FormContent>
                <Styles.FormLabel>Data</Styles.FormLabel>
                <Styles.FormSelect
                  value={dateSelected}
                  defaultValue={dateSelected}
                  onChange={(e) => {
                    setDateSelected(e.target.value)
                  }}
                >
                  {listDataAvaliable(ctxScheduling.daysOfTechnical).map(
                    (day) => {
                      return (
                        <option
                          value={day.day}
                          data-id={day.id}
                          key={`dateTechnical${day.id}`}
                        >
                          {formatedDate(day.day)}
                        </option>
                      )
                    }
                  )}
                </Styles.FormSelect>
              </Styles.FormContent>
            )}
        </Styles.FormModifyOrder>
        <Styles.FormButton type="button" onClick={() => saveModify()}>
          Salvar
        </Styles.FormButton>
      </Styles.ModalModifyOrderWrapper>
    </ModalContainer>
  )
}

export default ModalModifyOrder
