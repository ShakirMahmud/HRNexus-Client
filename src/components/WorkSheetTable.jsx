import { Button, Typography } from '@material-tailwind/react';
import { Pencil, Trash2 } from 'lucide-react';
import React from 'react';

const WorkSheetTable = ({ workSheetEntries, handleEditEntry, handleDeleteEntry }) => {
    return (
        <table className="w-full min-w-max table-auto text-left overflow-y-scroll border-2 max-h-screen">
                        <thead>
                            <tr>
                                {['Task', 'Hours', 'Date', 'Actions'].map((head) => (
                                    <th 
                                        key={head} 
                                        className="border-b border-neutral-200 dark:border-neutral-700 p-4 "
                                    >
                                        <Typography 
                                            variant="small" 
                                            className="text-neutral-600 dark:text-neutral-300"
                                        >
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className=''>
                            {workSheetEntries.map((entry, index) => (
                                <tr 
                                    key={index} 
                                    className="hover:bg-neutral-50 dark:hover:bg-dark-background/50 border-2 border-neutral-200 dark:border-neutral-700"
                                >
                                    <td className="p-4">{entry.task}</td>
                                    <td className="p-4">{entry.hours}</td>
                                    <td className="p-4">{entry.date.toLocaleDateString()}</td>
                                    <td className="p-4 flex gap-2">
                                        <Button 
                                            size="sm" 
                                            variant="text"
                                            onClick={() => handleEditEntry(entry)}
                                            className="text-primary-500 hover:bg-primary-50"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="text"
                                            onClick={() => handleDeleteEntry(entry)}
                                            className="text-danger-500 hover:bg-danger-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
    );
};

export default WorkSheetTable;