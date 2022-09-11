import React from 'react';
import Parcel from 'single-spa-react/parcel';

export const MicroComponent = ({ config, ...parcelProps }) => {
  return (
    <Parcel
      config={config}
      {...parcelProps}
    />
  )
}

export default MicroComponent
