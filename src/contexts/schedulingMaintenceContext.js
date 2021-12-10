import { CALENDAR_DAYS } from 'constants/temporary'
import { createContext, useEffect, useState } from 'react'
import { daysWeekList } from 'utils'

export const schedulingMaintenceContext = createContext()

const SchedulingMaintenceProvider = ({ children }) => {
  const [schedulingMaintenceDates, setSchedulingMaintenceDates] = useState([])
  const [weekSelected, setWeekSelected] = useState(0)

  useEffect(() => {
    //Verificar o que vem da api e mandar aqui
    const weekDays = daysWeekList(weekSelected, {
      //Pegar pela api os calendários dos dias
      default: CALENDAR_DAYS,
      exceptions: []
    })
    const schedulingMaintenance = Object.keys(weekDays).map(
      (weekDay) => weekDays[weekDay]
    )
    setSchedulingMaintenceDates(schedulingMaintenance)
  }, [])

  useEffect(() => {
    //Verificar o que vem da api e mandar aqui
    const weekDays = daysWeekList(weekSelected, {
      //Pegar pela api os calendários dos dias
      default: CALENDAR_DAYS,
      exceptions: []
    })
    const schedulingMaintenance = Object.keys(weekDays).map(
      (weekDay) => weekDays[weekDay]
    )

    setSchedulingMaintenceDates(schedulingMaintenance)
  }, [weekSelected])

  const saveMaintenanceSchedulingEditions = () => {
    //Realizar atualização quando houver a API
  }

  const setWeek = (week = 0) => {
    if (Number.isInteger(week)) {
      setWeekSelected(week)
      return false
    }

    setWeekSelected(0)
  }

  const editPeriodOfDayWeek = (dayPosition, periodPosition, value) => {
    const previewData = schedulingMaintenceDates.map((day, index) => {
      if (index === dayPosition) {
        day.periodsDay.scheduledPeriods[periodPosition].amount = value
      }
      return day
    })

    setSchedulingMaintenceDates(previewData)
  }

  const schedulingMaintenceValues = {
    schedulingMaintenceDates,
    saveMaintenanceSchedulingEditions,
    setWeek,
    editPeriodOfDayWeek
  }

  return (
    <schedulingMaintenceContext.Provider value={schedulingMaintenceValues}>
      {children}
    </schedulingMaintenceContext.Provider>
  )
}

export default SchedulingMaintenceProvider
