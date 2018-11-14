import * as React from 'react'

export type ErrorState = {
    hasError: boolean
    error: any
    info: string
}

export default class ErrorComponent<P, S> extends React.Component<P, S & ErrorState> {

}