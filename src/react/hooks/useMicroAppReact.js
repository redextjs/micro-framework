import { useContext } from 'react';
import { SingleSpaContext as MicroAppContext } from 'single-spa-react';

const useMicroAppReact = () => {
  return useContext(MicroAppContext)
};

export default useMicroAppReact