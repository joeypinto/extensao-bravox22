import ConfirmInstallation from 'components/ConfirmInstallation'
import Pagination from 'components/Pagination'
import SearchItems from 'components/SearchItems'

const ConfirmInstallationContainer = ({ data, pagination, typeRef }) => {
  return (
    <>
      <SearchItems preRoute={'/oficinas-credenciadas/consulta-instalacao'} />
      <ConfirmInstallation list={data} />
      <Pagination
        amountpages={pagination.amountpages}
        currencyPage={pagination.currencyPage}
        prefixUrl={pagination.prefixUrl}
        searchWord={pagination.searchWord}
        typeRef={typeRef}
      />
    </>
  )
}

export default ConfirmInstallationContainer
