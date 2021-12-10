import dynamic from 'next/dynamic'
import MapContextProvider from 'contexts/mapContext'
import ModalScheduling from 'components/ModalScheduling'
import Filters from 'components/FiltersContent'
import FilterListCurrency from 'components/FilterListCurrency'

import * as Styles from './styles'

const MapContainer = () => {
  const MapWithNoSSR = dynamic(() => import('components/MapContent'), {
    ssr: false
  })


  return (
    <MapContextProvider>
      <Styles.MapWrapper>
        <Filters />
        <FilterListCurrency />
        <MapWithNoSSR />
      </Styles.MapWrapper>
      <ModalScheduling />
    </MapContextProvider>
  )
}

export default MapContainer
