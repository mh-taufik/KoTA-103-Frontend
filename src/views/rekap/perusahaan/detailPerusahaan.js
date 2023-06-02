import React from 'react';
import 'antd/dist/antd.css';
import { Tabs } from 'antd';

import IdentitasPerusahaan from './identitasPerusahaan';
import PrerequisitePerusahaan from './prerequisitePerusahaan'

const { TabPane } = Tabs;

const DetailPerusahaan = () => {
    return (
        <>
            <Tabs type="card">
                <TabPane tab="Identitas" key="1">
                    <IdentitasPerusahaan/>
                </TabPane>
                <TabPane tab="Prerequisite" key="2">
                    <PrerequisitePerusahaan/>
                </TabPane>
            </Tabs>
        </>
    )
}

export default DetailPerusahaan
