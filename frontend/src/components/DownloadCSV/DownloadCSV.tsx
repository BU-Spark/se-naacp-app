import React from 'react';
import { Button } from '@mui/material';
import { Article } from '../../__generated__/graphql';

interface DownloadCSVProps {
    articles: Article[];
}

const DownloadCSV: React.FC<DownloadCSVProps> = ({ articles }) => {
    const downloadCSV = () => {
        const csvRows = [
            ['ID', 'Title', 'Link', 'Date', 'Topic', 'Neighborhood', 'Tract', 'Locations', 'Coordinates'],
            ...articles.map(article => [
                article.content_id,
                article.hl1,
                article.link,
                article.pub_date,
                article.openai_labels,
                article.neighborhoods.join(', '),
                article.tracts.join(', '),
                article.locations?.join(', '),
                article.coordinates?.map(coord => coord.join(',')).join(';'),
            ])
        ];
        const csvString = csvRows.map(row => 
            row.map(value => `"${value}"`).join(',') // Wrap each value in quotes to handle commas
        ).join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'articles.csv');
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Button 
            variant="contained" 
            color="primary" 
            onClick={downloadCSV}
        >
            Download CSV
        </Button>
    );
};

export default DownloadCSV;