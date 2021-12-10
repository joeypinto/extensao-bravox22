import { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import { ptBR } from 'date-fns/locale'
import { parseISO, format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { MapContext } from 'contexts/mapContext'
import * as Styles from './styles'
import 'react-datepicker/dist/react-datepicker.css'
import {
  CLASSES_DATE_PICKER,
  INITIAL_NOTIFY_ERROR,
  LEGENDS_DAYS
} from 'constants/sheduling'
import { GlobalContext } from 'contexts/globalContext'
registerLocale('pt-BR', ptBR)

//Formatar para extrair o string necessário do DatePicker
const extractDataPicker = (dateRaw) => {
  const date = new Date(dateRaw)

  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
}

//Formatar para o New Date devido a Problema de converter
const formatDateStringToBar = (dateString) => {
  return String(dateString).replace(/-/gi, '/')
}

//Formatar para validar as datas
const formatDateToValidate = (date, formated = 0) => {
  const dateIsValid =
    formated === 0 ? new Date(formatDateStringToBar(date)) : date
  return (
    dateIsValid.getFullYear() +
    '-' +
    (dateIsValid.getMonth() + 1) +
    '-' +
    dateIsValid.getDate()
  )
}

//Formatar para usar o ParseIso
const formatedDateParseISO = (dateForConvert) => {
  return `${dateForConvert.getFullYear()}-${String(
    dateForConvert.getMonth() + 1
  ).padStart(2, '0')}-${String(dateForConvert.getDate()).padStart(2, '0')}`
}

const DialogScheduling = ({ tecnicalData }) => {
  const ctxContext = useContext(MapContext).filtersAndTecnicals
  const ctxGlobal = useContext(GlobalContext)

  const [dateSendProduct, setDateSendProduct] = useState('')
  const [notifyError, setNotifyError] = useState(INITIAL_NOTIFY_ERROR)
  const [periodTecnical, setPeriodTecnical] = useState([])
  const [dateSelect, setDateSelect] = useState(new Date())

  //Apresenta as datas no formato
  const formatDateToDisplay = (date) => {
    const parseDate = parseISO(formatedDateParseISO(date))

    return format(parseDate, "dd 'de' MMMM 'de' yyyy", {
      locale: ptBR
    })
  }

  //Avalia datas validas
  const validateDate = (dataToValidate) => {
    let listOfValidDates = tecnicalData.calenderTecnical.filter((validate) => {
      return (
        formatDateToValidate(validate.dateCalender) ===
        formatDateToValidate(dataToValidate)
      )
    })

    return listOfValidDates
  }

  //Valida dias disponiveis
  const validateCalenderDays = (daysList) => {
    let validDates = daysList.filter((day) => {
      return day.amount > 0
    })

    return validDates.length > 0 ? true : false
  }

  useEffect(() => {
    //pedido esta aqui e pode ser utilizado no lugar do useEffect
    const order = ctxContext.order
    //puxar por api da tray, provavel que pegue o format de data para utilizar
    setDateSendProduct('2021-7-29')

    const validDaysOfTechnicalAssistance = tecnicalData.calenderTecnical.filter(
      (date) => {
        return (
          validateCalenderDays(date.periods) &&
          new Date(formatDateStringToBar(date.dateCalender)) >= new Date()
        )
      }
    )

    const selectedDates =
      validDaysOfTechnicalAssistance.length > 0
        ? validDaysOfTechnicalAssistance
        : false

    if (selectedDates) {
      if (new Date(selectedDates[0].dateCalender) >= new Date()) {
        setDateSelect(
          new Date(formatDateStringToBar(selectedDates[0].dateCalender))
        )
      }
    }

    const possiblePeriods = selectedDates
      ? selectedDates[0].periods.filter((period) => {
          return period.amount > 0
        })
      : []

    setPeriodTecnical(possiblePeriods)

    return null
  }, [])

  const validateDatesAndAssignCorrespondingClasses = (date) => {
    const dateIsValid = formatDateToValidate(date)
    const dateSendOrder = formatDateToValidate(dateSendProduct)
    const today = new Date()
    const todyIsBiggestDateCalender =
      new Date(formatDateStringToBar(date)) < today

    if (
      new Date(formatDateStringToBar(dateIsValid)).getMonth() < today.getMonth()
    ) {
      //Verifica se está dentro do mês
      return CLASSES_DATE_PICKER.DONT_MONTH_CURRENCY
    } else if (todyIsBiggestDateCalender) {
      //Verifica se o dia é após o dia atual
      return CLASSES_DATE_PICKER.DISABLED
    } else if (
      dateIsValid === dateSendOrder &&
      validateDate(dateSendOrder).length <= 0
    ) {
      //Verifica se o dia é após o dia atual
      return CLASSES_DATE_PICKER.NO_DATE_SEND_PRODUCT
    } else if (
      dateIsValid === dateSendOrder &&
      validateDate(dateSendOrder).length > 0
    ) {
      //Verifica se o dia é exatamente igual o dia da entrega do pedido
      return CLASSES_DATE_PICKER.DATE_SEND_PRODUCT
    } else if (
      new Date(formatDateStringToBar(dateIsValid)) < today ||
      new Date(formatDateStringToBar(dateIsValid)) <
        new Date(formatDateStringToBar(dateSendOrder))
    ) {
      //Verifica se a data é anterior a de hoje ou anterior a data de envio
      return CLASSES_DATE_PICKER.DISABLED
    } else if (validateDate(dateIsValid).length > 0) {
      //Verifica se a data é válida
      return CLASSES_DATE_PICKER.AVALIABLE
    } else {
      //Caso passe por todas essas validações desabilita
      return CLASSES_DATE_PICKER.UNVALIABLE
    }
  }

  const validPeriods = (selectedDate) => {
    let amountForDate = tecnicalData.calenderTecnical.filter((dateAnalisy) => {
      return formatDateToValidate(dateAnalisy.dateCalender) === selectedDate
    })

    let newPeriods = amountForDate[0].periods.filter((newPeriod) => {
      return newPeriod.amount > 0
    })

    setPeriodTecnical(newPeriods)
  }

  const changeDateState = (date) => {
    let validate = validateDatesAndAssignCorrespondingClasses(date)

    if (validate === 'avaliable' || validate === 'dateSendProduct') {
      setNotifyError(INITIAL_NOTIFY_ERROR)

      let dateFormated = formatDateToValidate(date)

      ctxContext.changeSchedulingDate('dateScheduling', dateFormated)

      setDateSelect(new Date(formatDateStringToBar(date)))

      validPeriods(dateFormated)
    } else {
      setNotifyError({
        ...notifyError,
        message: 'Data inválida.'
      })
    }
  }

  return (
    <Styles.ModalSchedulingDialog role="document">
      <Styles.DialogHeader>
        <Styles.DialogHeaderTitle>
          {tecnicalData.NOME} | {tecnicalData.BAIRRO} - {tecnicalData.ESTADO}
        </Styles.DialogHeaderTitle>
        <Styles.ButtonCloseScheduling
          type="button"
          aria-label="Ícone de fechar"
          onClick={() => {
            ctxGlobal.toggleModalContainer('init')
            ctxContext.openDialogConfirmed()
          }}
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </Styles.ButtonCloseScheduling>
      </Styles.DialogHeader>

      <Styles.DialogWrapper>
        <Styles.DivisorDialogScheduling>
          <ReactDatePicker
            selected={dateSelect}
            dayClassName={(date) =>
              validateDatesAndAssignCorrespondingClasses(
                extractDataPicker(date)
              )
            }
            onChange={(e) => changeDateState(extractDataPicker(e))}
            locale="pt-BR"
            inline
          />
        </Styles.DivisorDialogScheduling>

        <Styles.DivisorDialogScheduling>
          <Styles.DialogPeriodContent>
            <Styles.DialogLabel htmlFor="selectPeriod">
              Período
            </Styles.DialogLabel>
            {periodTecnical.length > 0 &&
            (validateDatesAndAssignCorrespondingClasses(
              formatDateToValidate(dateSelect, 1)
            ) === 'dateSendProduct' ||
              validateDatesAndAssignCorrespondingClasses(
                formatDateToValidate(dateSelect, 1)
              ) === 'avaliable') ? (
              <Styles.DialogSelect
                id="selectPeriod"
                onChange={(e) => ctxContext.changeScheduling('period', e)}
              >
                {periodTecnical.map((period) => {
                  return (
                    <option
                      key={uuidv4()}
                      value={period.period}
                      data-ref={period.label}
                    >
                      {period.label}
                    </option>
                  )
                })}
              </Styles.DialogSelect>
            ) : (
              <Styles.DialogAlertDontPeriod>
                Nenhum período disponível
              </Styles.DialogAlertDontPeriod>
            )}
          </Styles.DialogPeriodContent>
        </Styles.DivisorDialogScheduling>
        <Styles.DivisorDialogScheduling>
          <Styles.ConfirmedInfo>
            <Styles.ConfirmedInfoTitle>Confirmação</Styles.ConfirmedInfoTitle>
            {notifyError.message !== '' && (
              <Styles.ConfirmedInfoError>
                {notifyError.message}
              </Styles.ConfirmedInfoError>
            )}
            <Styles.ConfirmedInfoSubTitle>
              Será Marcada para o dia:
            </Styles.ConfirmedInfoSubTitle>
            <Styles.ConfirmedInfoDate>
              {notifyError.message != ''
                ? '-- '
                : `${formatDateToDisplay(dateSelect)} - `}
              {ctxContext.scheduling.period === ''
                ? '--'
                : ctxContext.scheduling.schedulinglabel}
            </Styles.ConfirmedInfoDate>
          </Styles.ConfirmedInfo>
          <Styles.Confirmedbutton type="button">
            Confirmar
          </Styles.Confirmedbutton>
        </Styles.DivisorDialogScheduling>
      </Styles.DialogWrapper>
      <Styles.DialogFooter>
        <Styles.FooterContent>
          <Styles.FooterTitle>Legenda:</Styles.FooterTitle>
          <Styles.FooterLegend>
            {LEGENDS_DAYS.map((legend) => {
              return (
                <Styles.LegendItem key={`#${legend.id}`}>
                  <Styles.FooterImageLegend
                    className={legend.classLegend}
                    role="img"
                  />
                  <Styles.LegendLabel>{legend.legend}</Styles.LegendLabel>
                </Styles.LegendItem>
              )
            })}
          </Styles.FooterLegend>
        </Styles.FooterContent>
      </Styles.DialogFooter>
    </Styles.ModalSchedulingDialog>
  )
}

export default DialogScheduling
