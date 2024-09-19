import React, { useState } from "react";
import { Article } from "../../__generated__/graphql";
import { Button, Modal, Box, Typography, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { List, ListItem, ListItemText } from "@mui/material"; // Add List imports



interface TopicCountProps {
  articles: Article[];
}

const TopicCount: React.FC<TopicCountProps> = ({ articles }) => {
  const [open, setOpen] = useState(false);
  const topicCounts: Record<string, number> = {};
  const navigate = useNavigate();

  // Count occurrences of each topic
  articles.forEach((article) => {
    const topic = article.openai_labels;
    if (topic) {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    }
  });

  // Get top 5 topics
  const topTopics = Object.entries(topicCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5);

  // Handle modal open/close
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Navigate to topic page
  const handleTopicClick = (topic: string) => {
    navigate(`/Topics?topic=${encodeURIComponent(topic)}`);
  };

  return (
    <Card sx={{ height: "62vh" }}>
      <CardContent sx={{ height: "100%" }}>
        <List> {/* Use List component */}
          {topTopics.map(([topic, count]) => (
            <ListItem key={topic} onClick={() => handleTopicClick(topic)} style={{ cursor: 'pointer', color:'#1E90FF' }}>
              <ListItemText primary={`${topic}: ${count}`} />
            </ListItem>
          ))}
        </List>
        <Button variant="outlined" onClick={handleOpen}>
          View All Topics Count
        </Button>
    
        <Modal open={open} onClose={handleClose}>
        <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            bgcolor: 'background.paper', 
            boxShadow: 24, 
            p: 4, 
            maxHeight: '80vh', 
            overflowY: 'auto',
            width: '80%', // Make modal wider
        }}>
            <Typography variant="h6" component="h2">
            All Topic Counts
            </Typography>
            <List sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}> {/* Use flexbox for layout */}
            {Object.entries(topicCounts)
            .sort(([, countA], [, countB]) => countB - countA) // Sort by count in descending order
            .map(([topic, count]) => (
                <ListItem key={topic} onClick={() => handleTopicClick(topic)} style={{ cursor: 'pointer', width: '23%', color:'#1E90FF' }}>
                    <ListItemText primary={`${topic}: ${count}`} />
                </ListItem>
            ))}
            </List>
            <Button onClick={handleClose}>Close</Button>
          </Box>
        </Modal>
      </CardContent>
    </Card>
  );
}
export default TopicCount;