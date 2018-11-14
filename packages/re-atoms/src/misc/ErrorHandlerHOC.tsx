import * as React from 'react'

type WithErrorHandlerState = {
    error: Error
    errorInfo: any
    hasError: boolean
}

type HocProps<P> = P & {
    onError: (err: Error, info: any) => void,
    ErrorComponent: React.ComponentClass<P>,
    Component: React.ComponentClass<P>
}

type ErrorComponentProps<P> = P & {
    error: Error
    errorInfo: any
}

const defaultErrorHandler = (error: Error, info: any) => console.error(error)

const DefaultShowError = (props: ErrorComponentProps<any>) =>
    <div>
        {`error : ${props.error.name}(${props.error.message}):
        ${props.error.stack} with additional information ${props.errorInfo}`}
    </div> as React.ReactElement<ErrorComponentProps<any>>

function withErrorHandler<P>(
    onError: (error: Error, errorInfo: any) => any = defaultErrorHandler,
    ErrorComponent: React.ComponentClass<ErrorComponentProps<P>> | React.ReactElement<P> = DefaultShowError,
    Component: React.ComponentClass<P>
): React.ComponentClass<P> {
    return class extends React.Component <HocProps<P>, WithErrorHandlerState> {
        constructor() {
            super()
            this.state = {
                error: null,
                errorInfo: null,
                hasError: false,
            }
        }

        componentDidCatch(error, errorInfo) {
            this.setState(
                prevState => ({...prevState, error, errorInfo}),
                () => onError(this.state.error, this.state.errorInfo)
            )
        }

        render() {
            if (this.state.error) {
                const {error, errorInfo} = this.state
                return <ErrorComponent {...this.props} error={error} errorInfo={errorInfo}/>
            }
            return <Component {...this.props}/>
        }
    }
}

export default withErrorHandler
