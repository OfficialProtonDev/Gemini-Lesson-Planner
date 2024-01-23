'use client';
import * as React from 'react';
import { styled } from '@mui/system';
import { Tabs } from '@mui/base/Tabs';
import { TabsList as BaseTabsList } from '@mui/base/TabsList';
import { TabPanel as BaseTabPanel } from '@mui/base/TabPanel';
import { buttonClasses } from '@mui/base/Button';
import { Tab as BaseTab, tabClasses } from '@mui/base/Tab';

export default function ToolBar() {
  return (
    <Tabs aria-label="Basic tabs" defaultValue={0}>
      <TabsList>
        <Tab>First tab</Tab>
        <Tab>Second tab</Tab>
        <Tab>Third tab</Tab>
      </TabsList>
      <TabPanel value={0}>
        <b>First</b> tab panel
      </TabPanel>
      <TabPanel value={1}>
        <b>Second</b> tab panel
      </TabPanel>
      <TabPanel value={2}>
        <b>Third</b> tab panel
      </TabPanel>
    </Tabs>
  );
}

const blue = {
  50: '#F0F7FF',
  100: '#C2E0FF',
  200: '#80BFFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
  800: '#004C99',
  900: '#003A75',
};

const Tab = styled(BaseTab)`
  font-family: 'IBM Plex Sans', sans-serif;
  color: black;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: bold;
  background-color: transparent;
  line-height: 1.5;
  aspect-ratio : 3 / 1;
  height: 70%;
  padding: 8px 12px;
  margin: 6px;
  border: none;
  border-radius: 8px;
  display: flex;
  justify-content: center;

  background: transparent;

  &:hover {
  }

  &.${tabClasses.selected} {
    background: rgba( 255, 255, 255, 0.25 );
    box-shadow: 0 1px 4px 0 rgba( 31, 38, 135, 0.12 );
backdrop-filter: blur( 4px );
-webkit-backdrop-filter: blur( 4px );
border-radius: 10px;
border: 1px solid rgba( 255, 255, 255, 0.18 );
  }

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabPanel = styled(BaseTabPanel)`
  width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
`;

const TabsList = styled(BaseTabsList)(
  ({ theme }) => `
    overflow: hidden;
    display: inline-flex!important;
    height: 50px;

    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    align-content: space-between;

  `,
);
