import { marked } from 'marked';
import { Input, Form, Button, Spin, Tabs } from 'antd';
import { useState, useRef } from 'react';

export default function Home() {
  //add useRef
  const [items, setItems] = useState([]);
  const [markdown, setMarkdown] = useState('');
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const index = useRef(0);
  const last = useRef(0);
  const prevToken = useRef(0);

  return (
    <>
      <div style={{ width: '60%', margin: 'auto' }}>
        <Form
          form={form}
          style={{
            paddingTop: '20px',
          }}
          onFinish={async e => {
            setMarkdown('');
            setLoading(true);
            let prompt = [];
            for (let i = index.current; i < items.length; i++) {
              prompt.push({ role: 'user', content: items[i].label });
              prompt.push({ role: 'assistant', content: items[i].text });
            }
            prompt.push({ role: 'user', content: e.text });
            console.log(prompt);
            console.log(
              JSON.stringify({
                prompt: prompt,
              })
            );
            const text = await fetch('/api/chatgpt', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                prompt: prompt,
              }),
            });
            const json = await text.json();
            console.log(json);
            const result = json.choices[0].message.content;
            const markdown = marked.parse(result);
            setTab(items.length);
            setItems([
              ...items,
              {
                label: e.text,
                children: (
                  <div dangerouslySetInnerHTML={{ __html: markdown }} />
                ),
                key: items.length,
                text: result,
                token: json.usage.total_tokens - prevToken.current,
              },
            ]);
            prevToken.current = json.usage.total_tokens;
            while (prevToken.current > 2000) {
              prevToken.current -= items[last.current].token;
              last.current++;
            }
            form.setFieldValue('text', '');
            setLoading(false);
          }}
        >
          <Form.Item lable='text' name='text'>
            <TextArea lable='text' name='text' />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              style={{ marginRight: '20px' }}
            >
              Submit
            </Button>
            <Button
              htmlType='button'
              onClick={() => {
                setTab(0);
                setItems([]);
                index.current = 0;
                last.current = 0;
                prevToken.current = 0;
              }}
            >
              Reset
            </Button>
          </Form.Item>
        </Form>
        {/* {loading && <Spin />} */}
        <Spin spinning={loading}>
          <Tabs items={items} activeKey={tab} onChange={key => setTab(key)} />
        </Spin>
        <div dangerouslySetInnerHTML={{ __html: markdown }} />
      </div>
    </>
  );
}
