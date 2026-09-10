import { Card } from '../../components/common/Card'
import { ViewOnSiteButton } from '../../components/common/ViewOnSite'
import { PageHeader } from '../../components/layout/PageHeader'
import { UsersTab } from '../settings/SettingsPage'

/**
 * The people who can sign in.
 *
 * This was a tab inside Settings until Team got a sidebar entry. The screen
 * itself is unchanged and still lives in `SettingsPage` — re-exported rather
 * than copied, because two versions of a working account editor is one to keep
 * in step for no benefit.
 */
export default function TeamPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        description="Who can sign in to the CMS, and the byline each writes under"
        actions={<ViewOnSiteButton module="team" />}
      />
      <Card flush>
        <UsersTab />
      </Card>
    </div>
  )
}
