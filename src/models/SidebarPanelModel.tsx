import { useState } from 'react';

const SidebarPanelModel = () => {
  const [visible, setVisible] = useState(true);

  return { visible, setVisible };
};
export default SidebarPanelModel;
