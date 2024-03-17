
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Select, Input, InputNumber } from "antd";
export default function EditItem(props) {
  const [form] = Form.useForm();
  
  const handleOk = () => {
    props.setIsOpen(false);
    props.setItem(null);
  };
  const handleCancel = () => {
    props.setIsOpen(false);
    props.setItem(null);
  };
  const handleFormSubmit = () => {
    form.validateFields().then(formData => {
        props.onItemEdited({id: props.item.id, key: props.item.key, ...formData});
        handleOk();})
  };
  useEffect(() => {
    console.log("Props.item:", props.item);
    if (props.isOpen) {
        form.setFieldsValue(props.item)
    }
  }, [props.isOpen])
  return (
    <>
      <Modal
        title="Edit Transaction"
        open={props.isOpen}
        onOk={handleFormSubmit}
        onCancel={handleCancel}
        footer={(_, { CancelBtn }) => (
            <>
              <CancelBtn onClick={handleCancel} />
              <Button type="primary" htmlType="submit" onClick={handleFormSubmit}>Edit</Button>
            </>
          )}
      >
        <Form
          form={form}
          layout="horizontal"
          onFinish={(formData) => {
            props.onItemEdited(formData);
          }}
        >
          <Form.Item name="type" label="ชนิด" rules={[{ required: true }]}>
            <Select
              allowClear
              style={{ width: "100px" }}
              options={[
                {
                  value: "income",
                  label: "รายรับ",
                },
                {
                  value: "expense",
                  label: "รายจ่าย",
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="amount"
            label="จำนวนเงิน"
            rules={[{ required: true }]}
          >
            <InputNumber placeholder="จำนวนเงิน" />
          </Form.Item>
          <Form.Item name="note" label="หมายเหตุ" rules={[{ required: true }]}>
            <Input placeholder="Note" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
