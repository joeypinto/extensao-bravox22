import UserTemplate from 'templates/UserTemplate'
import UserContainer from 'containers/UserContainer'
import { ORDERS } from 'constants/temporary'
import MyAppointmentsContainer from 'containers/MyAppointmentsContainer'
import Menu from 'components/Menu'
import { useRouter } from 'next/router'
import jwt from 'jsonwebtoken'

const Appointments = (props) => {
  const router = useRouter()
  const queryPage = router.query.page ? router.query.page : 1

  return (
    <UserTemplate
      headers={{
        title: 'Meus Agendamentos',
        description: 'Agendos feitos no sistema Bravox',
        userId: props.userId
      }}
    >
      <UserContainer
        menu={
          <Menu
            titleMenu="Usuário"
            linksMenu={[
              {
                link: `/agendamentos`,
                slug: 'myAppointments',
                label: 'Meus Agendamentos'
              }
            ]}
            pageCurrency="myAppointments"
          />
        }
        title="Meus Agendamentos"
        body={
          <MyAppointmentsContainer
            idUser={props.userId}
            appointmentList={props.appointments}
            page={queryPage}
          />
        }
      />
    </UserTemplate>
  )
}

export async function getServerSideProps(context) {
  //Da API os agendamentos do usuarios na teia
  const ordersForUser = ORDERS

  //pegar id do user so splitar e passar
  const infoUser =
    context.req.headers.cookie != undefined
      ? jwt.decode(context.req.headers.cookie.split('=')[1])
      : null
  const idUser = infoUser !== null ? parseInt(infoUser.idUser) : undefined

  if (idUser === undefined) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  }

  return {
    props: {
      userId: idUser,
      appointments: ordersForUser
    }
  }
}

export default Appointments
