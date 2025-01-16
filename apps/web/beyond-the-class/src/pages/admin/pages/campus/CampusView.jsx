

import React from 'react';
import {
    Box,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Avatar,
    CardActionArea,
    CardActions,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


import { useEffect, useState } from 'react';
import axiosInstance from '../../../../config/users/axios.instance';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { CardLink } from 'react-bootstrap';

export default function CampusView() {
    const [allCampus, setAllCampus] = useState([]);
    const navigate = useNavigate();

    // Fetch all campuses
    useEffect(() => {
        const fetchAllCampus = async () => {
            try {
                const res = await axiosInstance.get('/api/super/all-campuses');
                setAllCampus(res.data);
                console.log(res.data)
            } catch (error) {
                console.error('Error fetching campuses:', error);
                setAllCampus([]);
            }
        };
        fetchAllCampus();
    }, []);

    // Handle editing campus
    const handleEditCampus = (campusId) => {
        navigate(`/super/campus/edit/${campusId}`);
    };

    // Handle deleting campus
    const handleDeleteCampus = async (campusId) => {
        try {
            const res = await axiosInstance.delete(`/api/super/campus/${campusId}`);
            if (res.status === 200) {
                setAllCampus(allCampus.filter((campus) => campus._id !== campusId));
                alert('Campus deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting campus:', error);
            alert('Error deleting campus');
        }
    };

    return (
        <div className="flex flex-col font-thin py-8 px-3">
            <div className="flex flex-row justify-between mb-4">
                <h1 className="text-2xl font-bold">All Campuses</h1>
                {/* Button to Create a New Campus */}
                <Link to="/super/campus/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Create New Campus
                </Link>
            </div>




            <UniversityInfo data={allCampus} />



            {allCampus.length === 0 ? (
                <p>No campuses available</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-fit dark:text-white dark:bg-[#1e1e1e] text-black rounded-lg">
                        <thead>
                            <tr>
                                <th className="py-3 px-4 text-left">Name</th>
                                <th className="py-3 px-4 text-left">Location</th>
                                <th className="py-3 px-4 text-left">Academic Format</th>
                                <th className="py-3 px-4 text-left">University</th>
                                <th className="py-3 px-4 text-left">Users</th>
                                <th className="py-3 px-4 text-left">Societies</th>
                                <th className="py-3 px-4 text-left">Sub Societies</th>
                                <th className="py-3 px-4 text-left">Registration Status</th>
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allCampus.map((campus) => (
                                <tr key={campus._id} className="border-b border-gray-700">
                                    <td className="py-3 px-4">{campus.name}</td>
                                    <td className="py-3 px-4">{campus.location || 'Not Provided'}</td>
                                    <td className="py-3 px-4">{campus.academic?.FormatType || 'Not Provided'}</td>
                                    <td className="py-3 px-4">{campus.universityOrigin?.name || 'No University'}</td>
                                    <td className="py-3 px-4">{campus?.users.length || '0'}</td>
                                    <td className="py-3 px-4">{campus?.society.alumni.length + campus?.society.teachers.length + campus?.society.student.length || '0'}</td>
                                    <td className="py-3 px-4">{campus?.subSociety.alumni.length + campus?.subSociety.teachers.length + campus?.subSociety.student.length || '0'}</td>
                                    <td className="py-3 px-4">
                                        <span className={`text-${campus.registered?.isRegistered ? 'green' : 'red'}-500 font-semibold`}>
                                            {campus.registered?.isRegistered ? 'Registered' : 'Not Registered'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 space-x-2 flex flex-row">
                                        {/* Edit Button */}
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                            onClick={() => handleEditCampus(campus._id)}
                                        >
                                            Edit
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg"
                                            onClick={() => handleDeleteCampus(campus._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}



const UniversityInfo = ({ data }) => {
    const [tabValue, setTabValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Tabs
                value={tabValue}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ marginBottom: 3 }}
                className=' text-black dark:text-white'
            >
                {data && data.map((university, index) => (
                    <Tab
                        className=' text-black dark:text-white'
                        key={university._id}
                        label={university.name}
                        id={`tab-${index}`}
                        aria-controls={`tabpanel-${index}`}
                    />
                ))}
            </Tabs>

            {data && data.map((university, index) => (
                <Box
                    key={university._id}
                    role="tabpanel"
                    hidden={tabValue !== index}
                    id={`tabpanel-${index}`}
                    aria-labelledby={`tab-${index}`}
                >
                    {tabValue === index && (
                        <Card sx={{ display: 'flex', mb: 4 }} className='dark:bg-[#1e1e1e] bg-white text-black dark:text-white'>
                            <CardMedia
                                component="img"
                                sx={{ width: 200, height: 200 }}
                                image={university.picture || 'https://via.placeholder.com/200'}
                                alt={`${university.name} logo`}
                            />
                            <CardContent>
                                <Typography variant="h5">{university.name}</Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    Location: {university.location}
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    Telephone: {university.universityOrigin.telephone || 'N/A'}
                                </Typography>
                                <Accordion sx={{ mt: 2 }} className='dark:bg-[#1e1e1e] bg-white text-black dark:text-white dark:border border-white' >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel-content"
                                        id="panel-header"
                                    >
                                        <Typography>Societies</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="body1">
                                            Alumni: {university.society.alumni.length} <br />
                                            Students: {university.society.student.length} <br />
                                            Teachers: {university.society.teachers.length}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>

                                <CardActionArea>
                                    <CardActions sx={{ mt: 3 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            href={university.websiteUrl}
                                            target="_blank"
                                        >
                                            Visit University Website
                                        </Button>
                                    </CardActions>
                                </CardActionArea>
                            </CardContent>
                        </Card>
                    )}

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Departments
                        </Typography>
                        {university.departments.length ? (
                            <TableContainer className='dark:bg-[#1e1e1e] bg-white text-black dark:text-white dark:border border-white'>
                                <Table className=' text-black dark:text-white'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className=' text-black dark:text-white'>Department Name</TableCell>
                                            <TableCell className=' text-black dark:text-white' align="left">Teachers</TableCell>
                                            <TableCell className=' text-black dark:text-white' align="left">Students</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {university.departments.map((dept) => (
                                            <TableRow key={dept._id}>
                                                <TableCell className=' text-black dark:text-white'>{dept.name}</TableCell>
                                                <TableCell className=' text-black dark:text-white' align="left">N/A</TableCell>
                                                <TableCell className=' text-black dark:text-white' align="left">N/A</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography>No departments available.</Typography>
                        )}
                    </Box>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Email Patterns
                        </Typography>
                        <Typography>
                            Domain: {university.emailPatterns.domain} <br />
                            Regex: {university.emailPatterns.regex}
                        </Typography>
                    </Box>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Campus Users
                        </Typography>
                        {university.users.length ? (
                            <Box>
                                {university.users.map((user) => (
                                    <Card
                                        key={user._id}
                                        sx={{ display: 'inline-block', m: 1 }}
                                        className='dark:bg-[#1e1e1e] p-1 bg-white text-black dark:text-white dark:border border-white'
                                    >
                                        <Avatar

                                            src={user.profile.picture}
                                            sx={{ width: '20px', height: '20px' }}
                                        >
                                        </Avatar>
                                        <Typography
                                            className=' text-black dark:text-white'
                                            variant='subtitle1'
                                            sx={{ fontSize: 'x-small' }}>
                                            {user.name}
                                        </Typography>

                                        <Typography
                                            className=' text-black dark:text-white'
                                            variant='subtitle2'
                                            sx={{ fontSize: 'xx-small' }}>
                                            {user.role}
                                        </Typography>
                                    </Card>
                                ))}
                            </Box>
                        ) : (
                            <Typography>No users available.</Typography>
                        )}
                    </Box>


                </Box>
            ))}
        </Box>
    );
};