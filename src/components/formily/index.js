import React from 'react'
import {
  SchemaForm,
  FormButtonGroup,
  Submit,
  Reset,
} from '@formily/antd'
import { Input, Select } from '@formily/antd-components'
import 'antd/dist/antd.css'

export default () => {
  return (
    <SchemaForm
      components={{ Input, Select }}
      schema={{
        type:"object",
        properties:{
          name:{
            type:"string",
            title:"Name",
            "x-component":"Input"
          },
          select: {
            "key": "select",
            "type": "string",
            "enum": [
              "1",
              "2",
              "3",
              "4"
            ],
            "title": "Select",
            "name": "select",
            "x-component": "Select"
          },
        }
      }}
      onSubmit={(values)=>{
        console.log(values)
      }}
    >
      <FormButtonGroup>
        <Submit>查询</Submit>
        <Reset>重置</Reset>
      </FormButtonGroup>
    </SchemaForm>
  )
}