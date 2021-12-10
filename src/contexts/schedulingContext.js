import { createContext, useState, useEffect } from 'react'
import { TECHNICAL_DAYS } from '../constants/temporary'

export const SchedulingContext = createContext()

const SchedulingContextProvider = ({ children }) => {
  const [scheduling, setScheduling] = useState([])
  const [maintenance, setMaintenanceScheduling] = useState([])
  const [daysOfTechnical, setDaysOfTechnical] = useState([])
  const [orderSelected, setOrderSelected] = useState({})
  const [periodSelected, setPeriodSelected] = useState('morning')

  useEffect(() => {
    //Vir da api após pegar o id do técnicao
    setDaysOfTechnical(TECHNICAL_DAYS)
  }, [])

  useEffect(() => {
    setPeriodSelected(orderSelected.period)
  }, [orderSelected])

  const initScheduling = (arr) => setScheduling(arr)
  const initMaintenanceScheduling = (arr) => setMaintenanceScheduling(arr)

  const selectedMaintenancePeriod = (event) => {
    const valueSelected = event.target.value === '' ? 0 : event.target.value
    setPeriod(valueSelected)
  }

  const changeScheduling = (event) => {
    const value = event.target.value
    const day = parseInt(event.target.getAttribute('data-day'))
    const period = event.target.getAttribute('data-period')

    const tempScheduling = scheduling.map((schedule, index) => {
      if (index === day) {
        schedule.scheduledPeriods[period].amount = parseInt(value)
      }
      return schedule
    })
    setScheduling(tempScheduling)
  }

  const saveSchedulingEditions = () => {
    //Realizar atualização quando houver a API
  }

  const saveInfoOrderModify = (
    id,
    dateCurrencyOrder,
    periodOrder,
    reset = false
  ) => {
    const data = reset
      ? {}
      : {
          id: id,
          dateCurrencyOrder: dateCurrencyOrder,
          period: periodOrder
        }
    setOrderSelected(data)
  }

  const SchedulingState = {
    maintenance,
    scheduling,
    daysOfTechnical,
    orderSelected,
    periodSelected,
    changeScheduling,
    initScheduling,
    initMaintenanceScheduling,
    saveSchedulingEditions,
    selectedMaintenancePeriod,
    saveInfoOrderModify,
    setPeriodSelected
  }

  return (
    <SchedulingContext.Provider value={SchedulingState}>
      {children}
    </SchedulingContext.Provider>
  )
}

export default SchedulingContextProvider
