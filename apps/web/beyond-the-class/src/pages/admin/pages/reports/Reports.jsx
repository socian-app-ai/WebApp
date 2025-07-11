import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../../config/users/axios.instance';
import useUniversityData from '../../hooks/useUniversityData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import ReportTypes from './components/ReportTypes';
import ReportsList from './components/ReportsList';
import BannedItems from './components/BannedItems';

const Reports = () => {
    const { CampusSelector, campus, UniversitySelector, currentUniversity } = useUniversityData();
    const [activeTab, setActiveTab] = useState("reports");

    return (
        <div className='flex flex-col gap-4 p-6'>
            <div className='flex gap-4 mb-6'>
                {UniversitySelector}
                {CampusSelector}
            </div>
            
            <h1 className='text-3xl font-bold mb-6'>Reports Management</h1>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 w-full mb-6">
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="report-types">Report Types</TabsTrigger>
                    <TabsTrigger value="banned-items">Banned Items</TabsTrigger>
                </TabsList>
                
                <TabsContent value="reports">
                    <ReportsList university={currentUniversity} campus={campus} />
                </TabsContent>
                
                <TabsContent value="report-types">
                    <ReportTypes />
                </TabsContent>
                
                <TabsContent value="banned-items">
                    <BannedItems />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Reports;