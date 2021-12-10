import { useContext, useEffect } from 'react'
import RecurringScheduleTecnical from 'components/RecurringScheduleTecnical'
import { SchedulingContext } from 'contexts/schedulingContext'
import { CALENDAR_DAYS } from 'constants/temporary'
import Button from 'components/Button'

const ScheduleTechnicalContainer = () => {
  const ctxScheduling = useContext(SchedulingContext)

  useEffect(() => {
    ctxScheduling.initScheduling(CALENDAR_DAYS)
  })
  return (
    <>
      {ctxScheduling.scheduling.length > 0 &&
        ctxScheduling.scheduling.map((schedule, index) => {
          return (
            <RecurringScheduleTecnical
              scheduling={schedule}
              key={schedule.id}
              indexDay={index}
            />
          )
        })}
      <Button
        type="button"
        text="Salvar"
        onClick={() => ctxScheduling.saveMaintenanceSchedulingEditions()}
      />
    </>
  )
}

export default ScheduleTechnicalContainer
