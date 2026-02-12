"use client";
import { useState, useEffect } from 'react';

export default function FormattedDate({ dateString }) {
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        if (dateString) {
            setFormattedDate(new Date(dateString).toLocaleDateString());
        }
    }, [dateString]);

    if (!formattedDate) return null;

    return <span>{formattedDate}</span>;
}
