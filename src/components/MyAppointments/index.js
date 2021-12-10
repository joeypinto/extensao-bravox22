import ActionButton from './ActionButton'
import ModalCancel from 'components/ModalCancel'
import ModalReview from 'components/ModalReview'
import * as Styles from './styles'

const MyAppointments = ({ appointmentsCurrency }) => {
  const classNameForText = {
    completed: 'concluded',
    canceled: 'cancel',
    pendenting: 'schedule_pendent',
    appointment: 'schedule'
  }

  const formatedData = (date) => {
    let newDate =
      new Date(date) instanceof Date && !isNaN(new Date(date))
        ? new Date(date)
        : '--'

    return newDate !== '--'
      ? `${String(newDate.getDate()).padStart(2, 0)}/${String(
          newDate.getMonth() + 1
        ).padStart(2, 0)}/${newDate.getFullYear()}`
      : '--'
  }

  return (
    <Styles.MyAppointmentsWrapper>
      <ModalCancel />
      <ModalReview />
      <Styles.HeaderAppointments>
        <h2 className="header__item">Código do Pedido</h2>
        <h2 className="header__item">Status do Agendamento</h2>
        <h2 className="header__item">Ações</h2>
      </Styles.HeaderAppointments>

      {appointmentsCurrency.length > 0 &&
        appointmentsCurrency.map((appointment) => {
          return (
            <Styles.Appointment key={`#${appointment.id}`}>
              <div className="appointment__fragment">
                <Styles.FragmentText>
                  <b>{appointment.id}</b>
                </Styles.FragmentText>
              </div>
              <div className="appointment__fragment">
                <Styles.FragmentStatus
                  className={classNameForText[appointment.status]}
                >
                  {appointment.status === 'completed' && 'Concluído'}
                  {appointment.status === 'pendenting' &&
                    'Pendente de agendamento'}
                  {appointment.status === 'canceled' && 'Cancelado'}
                  {appointment.status === 'appointment' &&
                    `Agendado | ${formatedData(appointment.dateChance)}`}
                </Styles.FragmentStatus>
              </div>
              <div className="appointment__fragment">
                <ActionButton data={appointment} />
              </div>
            </Styles.Appointment>
          )
        })}
    </Styles.MyAppointmentsWrapper>
  )
}

export default MyAppointments
