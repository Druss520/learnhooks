import React, { useEffect, useState, createElement } from 'react'
import {
  SchemaForm,
  SchemaMarkupField as Field,
  FormButtonGroup,
  FormEffectHooks,
  Submit,
  Reset,
  registerFormItemComponent,
  useDeepFormItem,
  FormItemShallowProvider,
  useShallowFormItem
} from '@formily/antd'
import { merge } from 'rxjs'
import { Input, Select } from '@formily/antd-components'
import { Form } from 'antd'
import 'antd/dist/antd.css'

const computeStatus = (props: ISchemaFieldAdaptorProps) => {
  if (props.loading) {
    return 'validating'
  }
  if (props.invalid) {
    return 'error'
  }
  if (props.warnings && props.warnings.length) {
    return 'warning'
  }
  return ''
}

const computeHelp = (props: ISchemaFieldAdaptorProps) => {
  if (props.help) return props.help
  const messages = [].concat(props.errors || [], props.warnings || [])
  return messages.length
    ? messages.map((message, index) =>
        createElement(
          'span',
          { key: index },
          message,
          messages.length - 1 > index ? ' ,' : ''
        )
      )
    : props.schema && props.schema.description
}

const computeLabel = (props: ISchemaFieldAdaptorProps) => {
  if (props.label) return props.label
  if (props.schema && props.schema.title) {
    return props.schema.title
  }
}

const computeExtra = (props: ISchemaFieldAdaptorProps) => {
  if (props.extra) return props.extra
}

const NextFormItemProps = [
  'colon',
  'htmlFor',
  'validateStatus',
  'prefixCls',
  'required',
  'labelAlign',
  'hasFeedback',
  'labelCol',
  'wrapperCol',
  'label',
  'help',
  'extra',
  'itemStyle',
  'itemClassName',
  'addonAfter'
]

export const pickFormItemProps = (props: any) => {
  const { selected } = pickProps(props, NextFormItemProps)
  if (!props.label && props.title) {
    selected.label = props.title
  }
  if (!props.help && props.description) {
    selected.help = props.description
  }
  if (selected.itemStyle) {
    selected.style = selected.itemStyle
    delete selected.itemStyle
  }
  if (selected.itemClassName) {
    selected.className = selected.itemClassName
    delete selected.itemClassName
  }
  return selected
}

const isType = (type: string | string[]) => (obj: unknown) =>
  obj != null &&
  (Array.isArray(type) ? type : [type]).some(
    t => Object.prototype.toString.call(obj) === `[object ${t}]`
  )
export const isArr = Array.isArray
export const isPlainObj = isType('Object')
export const isStr = isType('String')
export const isBool = isType('Boolean')
export const isNum = isType('Number')
export const isObj = (val: unknown) => typeof val === 'object'
export const isRegExp = isType('RegExp')

export function each(val: any, iterator: any, revert?: boolean): void {
  if (isArr(val) || isStr(val)) {
    if (revert) {
      for (let i: number = val.length - 1; i >= 0; i--) {
        if (iterator(val[i], i) === false) {
          return
        }
      }
    } else {
      for (let i = 0; i < val.length; i++) {
        if (iterator(val[i], i) === false) {
          return
        }
      }
    }
  } else if (isObj(val)) {
    let key: string
    for (key in val) {
      if (Object.hasOwnProperty.call(val, key)) {
        if (iterator(val[key], key) === false) {
          return
        }
      }
    }
  }
}


export const pickProps = (object: any, targets: string[]) => {
  const selected: any = {}
  const otherwise: any = {}
  each(object, (value: any, key: string) => {
    if (targets.includes(key)) {
      selected[key] = value
    } else {
      otherwise[key] = value
    }
  })
  return {
    selected,
    otherwise
  }
}

export const normalizeCol = (
  col?: { span: number; offset?: number } | number,
  defaultValue?: { span: number }
): { span: number; offset?: number } | undefined => {
  if (!col) {
    return defaultValue
  } else {
    return typeof col === 'object' ? col : { span: Number(col) }
  }
}

const computeSchemaExtendProps = (props: ISchemaFieldAdaptorProps) => {
  if (props.schema) {
    return pickFormItemProps({
      ...props.schema.getExtendsItemProps(),
      ...props.schema.getExtendsProps()
    })
  }
}

const components = {
  Input,
  Select,
}

const { onFieldChange$, onFieldInit$ } = FormEffectHooks

export default () => {
  const [selected, setSelected] = useState('')
  registerFormItemComponent(props => {
    const help = computeHelp(props)
    const label = computeLabel(props)
    const status = computeStatus(props)
    const extra = computeExtra(props)
    const itemProps = pickFormItemProps(props)
    const schemaItemProps = computeSchemaExtendProps(props)
    const formItemShallowProps = useShallowFormItem()
  
    const mergedProps = {
      label,
      ...formItemShallowProps,
      ...itemProps,
      ...schemaItemProps
    }
  
    const { labelCol, wrapperCol } = mergedProps
    const {
      prefixCls,
      labelAlign,
      labelCol: contextLabelCol,
      wrapperCol: contextWrapperCol
    } = useDeepFormItem()
    return (
      <div
        onClick={(e) => {
          console.log(e)
          console.log(props)
          setSelected(props.name)
        }}
        draggable
        style={{
          padding: '5px',
          border: selected === props.name ? '1px dashed #333' : '1px dashed #ccc',
        }}
      >全局扩展FormItem组件
        <Form.Item
          prefixCls={prefixCls}
          labelAlign={labelAlign}
          help={help}
          validateStatus={status}
          extra={extra ? <p>{extra}</p> : undefined}
          {...mergedProps}
          required={props.editable === false ? undefined : props.required}
          labelCol={mergedProps.label ? normalizeCol(labelCol || contextLabelCol) : undefined}
          wrapperCol={
            mergedProps.label ? normalizeCol(wrapperCol || contextWrapperCol) : undefined
          }
        >
          <FormItemShallowProvider>{props.children}</FormItemShallowProvider>
        </Form.Item>
      <div>
        X
      </div>
      </div>
    )
  })
  return (
    <SchemaForm
      labelCol={5}
      wrapperCol={14}
      components={components}
      effects={({ setFieldState }) => {
        merge(onFieldChange$('aa'), onFieldInit$('aa')).subscribe(
          fieldState => {
            setFieldState('bb', state => {
              state.visible = fieldState.value === '123'
            })
          }
        )
      }}
    >
      <Field
        type="string"
        title="AA"
        enum={[
          {label: '123', value: '123'},
          {label: '321', value: '321'},
        ]}
        name="aa"
        x-component="Select"
      />
      <Field
        type="string"
        title="BB"
        name="bb"
        x-component="Input"
      />
      <FormButtonGroup offset={5}>
        <Submit>查询</Submit>
        <Reset>重置</Reset>
      </FormButtonGroup>
    </SchemaForm>
  )
}