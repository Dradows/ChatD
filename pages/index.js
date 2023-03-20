import { marked } from 'marked';
import { Input, Form, Button, Spin, Tabs, Divider, message } from 'antd';
import { useState, useRef } from 'react';

export default function Home() {
  const [messageApi, contextHolder] = message.useMessage();
  const [items, setItems] = useState([]);
  const [markdown, setMarkdown] = useState('');
  const [form] = Form.useForm();
  const [feedback] = Form.useForm();
  const { TextArea } = Input;
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const index = useRef(0);
  // const last = useRef(0);
  // const prevToken = useRef(0);

  return (
    <>
      <div style={{ width: '60%', margin: 'auto' }}>
        {contextHolder}

        <Divider orientation='left'>聊天/Chat</Divider>
        <Form
          form={form}
          disabled={disabled}
          style={{
            paddingTop: '20px',
          }}
          onFinish={async e => {
            setDisabled(true);
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
            const json = await text.json().catch(e => {
              console.log(e);
              return { errorMessage: 'error' };
            });
            console.log(json);
            if ('errorMessage' in json) {
              messageApi.open({
                type: 'error',
                duration: 10,
                content:
                  '访问超时，请重试。若同一个问题多次访问均超时，请尝试更换问题。',
              });
              setLoading(false);
              setDisabled(false);
              return;
            }
            const result = json.choices[0].message.content;
            prompt.push({
              role: 'assistant',
              content: result,
            });
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
                // token: json.usage.total_tokens - prevToken.current,
              },
            ]);
            // prevToken.current = json.usage.total_tokens;
            // while (prevToken.current > 2000) {
            //   prevToken.current -= items[last.current].token;
            //   last.current++;
            // }
            form.setFieldValue('text', '');
            setLoading(false);
            setDisabled(false);
            fetch('/api/check', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                prompt: prompt,
              }),
            });
          }}
        >
          <Form.Item lable='text' name='text'>
            <TextArea
              lable='text'
              name='text'
              onKeyUp={e => {
                if (e.key == 'Enter' && e.shiftKey == false) {
                  e.preventDefault();
                  form.submit();
                }
              }}
              placeholder='开始对话吧！'
            />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              style={{ marginRight: '20px' }}
            >
              提交/Submit
            </Button>
            <Button
              htmlType='button'
              onClick={() => {
                setTab(0);
                setItems([]);
                index.current = 0;
                // last.current = 0;
                // prevToken.current = 0;
              }}
            >
              重置/Reset
            </Button>
          </Form.Item>
        </Form>
        {/* {loading && <Spin />} */}
        <Spin spinning={loading}>
          <Tabs items={items} activeKey={tab} onChange={key => setTab(key)} />
        </Spin>
        <div dangerouslySetInnerHTML={{ __html: markdown }} />

        <Divider orientation='left' style={{ marginTop: 300 }}>
          反馈或留言/Feedback
        </Divider>

        <Form
          form={feedback}
          onFinish={e => {
            console.log(e);
            fetch('/api/feedback', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                feedback: e.feedback,
              }),
            });
            messageApi.info('已提交反馈。');
          }}
        >
          <Form.Item lable='feedback' name='feedback'>
            <TextArea
              lable='feedback'
              name='feedback'
              placeholder='如有对网站的建议，或者想对我说的话，请在此处留言。'
              onKeyUp={e => {
                if (e.key == 'Enter' && e.shiftKey == false) {
                  e.preventDefault();
                  feedback.submit();
                }
              }}
            />
          </Form.Item>
          {/* add email */}
          <Form.Item lable='user' name='user'>
            <Input
              lable='user'
              name='user'
              placeholder='用户名（可选）'
            ></Input>
          </Form.Item>
          <Form.Item lable='email' name='email'>
            <Input
              lable='email'
              name='email'
              placeholder='联系方式（可选）'
            ></Input>
          </Form.Item>
          {/* add button */}
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
