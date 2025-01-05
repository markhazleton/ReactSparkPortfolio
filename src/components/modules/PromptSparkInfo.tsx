// components/PromptSparkInfo.tsx
import React from 'react';
import { Card } from 'react-bootstrap';

const PromptSparkInfo: React.FC = () => (
  <Card className="mb-4">
    <Card.Body>
      <Card.Title>What is PromptSpark?</Card.Title>
      <Card.Text>
        PromptSpark is a tool designed to help developers optimize their prompts for large language models (LLMs). 
        A "Variant Spark" represents a specific configuration or version of a prompt, allowing users to compare, 
        refine, and test different prompt strategies for their applications.
      </Card.Text>
      <Card.Text>
        PromptSpark is a powerful framework designed to help users optimize their usage of language models like GPT. 
        It provides a suite of tools for managing, tracking, and experimenting with prompts to enhance productivity 
        and ensure reliable outputs. By structuring your interactions with language models, PromptSpark helps you achieve higher efficiency and better outcomes.
      </Card.Text>
      <Card.Subtitle className="mt-3 mb-2">What is a Variant Spark?</Card.Subtitle>
      <Card.Text>
        A variant spark is a customized configuration or specialized prompt template tailored to a specific use case. 
        Variants allow you to adapt the behavior of the model for tasks like brainstorming, summarization, 
        data analysis, or other specialized functions. Each variant acts as a starting point for focused 
        and efficient interactions with the model.
      </Card.Text>
      <Card.Link href="https://webspark.markhazleton.com/PromptSpark/home/learnmore" target="_blank">
        Learn more about PromptSpark
      </Card.Link>
      <div className="ratio ratio-16x9">
        <iframe
          src="https://www.youtube.com/embed/GVAhKtAn0Sk?si=Ep91bh7YZvm3DuVr"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
    </Card.Body>
  </Card>
);

export default PromptSparkInfo;
