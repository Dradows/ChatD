import { marked } from 'marked';
import { Input, Form, Button, Spin } from 'antd';
import { useState } from 'react';

export default function Home() {
  const [markdown, setMarkdown] = useState('');
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [loading, setLoading] = useState(false);
  return (
    <>
      <div style={{ width: '60%', margin: 'auto' }}>
        <Form
          layout='vertical'
          style={{ paddingTop: '20px' }}
          onFinish={async e => {
            setMarkdown('');
            setLoading(true);
            const text = await fetch('/api/chatgpt/' + e.text);
            const json = await text.json();
            console.log(json);
            const result = json.text;
            setMarkdown(marked.parse(result));
            setLoading(false);
          }}
        >
          <Form.Item name='text'>
            <TextArea />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </Form.Item>
        </Form>
        {loading && <Spin />}
        <div dangerouslySetInnerHTML={{ __html: markdown }} />
      </div>
    </>
  );
}
