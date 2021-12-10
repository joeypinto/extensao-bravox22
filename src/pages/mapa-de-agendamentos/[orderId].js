import UserTemplate from 'templates/UserTemplate'
import MapContainer from 'containers/MapContainer'

//Nessa página tem que entrar somente ORDERs que tem os seguintes estados
//Cancelado, null ou pendente
// Quando um valor vem até essa página ele segue tres lógicas
// Está com estado Null, cria no banco de dados o agendamento e adiciona como pendente
// se for cancelado ele atualiza como pendente de agendamento.
// se for pendente não precisa fazer lógica

const map = (props) => {
  return (
    <UserTemplate
      headers={{
        title: `Bravox | Agendar Instalação ${props.order[0].orderId}`,
        description:
          'Agende sua instalação através das assistências técnicas do mapa'
      }}
    >
      <MapContainer />
    </UserTemplate>
  )
}

export async function getStaticProps({ params }) {
  //vindo da API Proveniente da Teia chamando com search
  const ordersByUser = [
    {
      orderId: 1,
      dataSend: '2021-7-29'
    },
    {
      orderId: 4093,
      dataSend: '2021-8-1'
    },
    {
      orderId: 3,
      dataSend: '2021-7-30'
    },
    {
      orderId: 4,
      dataSend: '2021-7-31'
    }
  ]

  const order = ordersByUser.filter((order) => {
    return String(order.orderId) === params.orderId
  })

  return {
    props: {
      order
    },
    revalidate: 10
  }
}

export async function getStaticPaths() {
  //Provenientes da API da teia
  const ordersByUser = [
    {
      orderId: 1
    },
    {
      orderId: 4093
    },
    {
      orderId: 3
    },
    {
      orderId: 4
    }
  ]

  const paths = ordersByUser.map((order) => ({
    params: {
      orderId: String(order.orderId)
    }
  }))

  return {
    paths: paths,
    fallback: false
  }
}

export default map
