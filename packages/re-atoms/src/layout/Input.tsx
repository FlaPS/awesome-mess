import * as React from 'react'

export type InputProps = React.HTMLAttributes<HTMLInputElement>

const Input: React.SFC<InputProps> =
    (props: InputProps) =>
        <input type={'text'} {...props} />

export default Input
