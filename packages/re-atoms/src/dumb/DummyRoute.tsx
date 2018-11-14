import * as React from 'react'
import {RouteConfigComponentProps} from '../app/navHelpers'
import PageLayout from '../layout/PageLayout'

export default (text = 'DummyComponent') => (props: RouteConfigComponentProps<any> & any) =>
    <PageLayout>
        <div>{text}<br/> route: {JSON.stringify(props.match)}</div>
    </PageLayout>

