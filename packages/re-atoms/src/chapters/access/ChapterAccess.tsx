import * as React from 'react'
import nav from '../../app/nav'
import TabbedPage from '../../layout/TabbedPage'

const tabs = () => [
    nav.app.access.users.index,
    nav.app.access.userGroups.index,
    nav.app.access.roles.index,
]

export const ChapterAccess = TabbedPage(tabs)
