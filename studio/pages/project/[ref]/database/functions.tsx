import { PermissionAction } from '@supabase/shared-types/out/constants'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'

import { CreateFunction, DeleteFunction } from 'components/interfaces/Database'
import FunctionsList from 'components/interfaces/Database/Functions/FunctionsList/FunctionsList'
import { DatabaseLayout } from 'components/layouts'
import { useProjectContext } from 'components/layouts/ProjectLayout/ProjectContext'
import NoPermission from 'components/ui/NoPermission'
import { useCheckPermissions, useStore } from 'hooks'
import { NextPageWithLayout } from 'types'
import { ScaffoldContainer, ScaffoldSection } from 'components/layouts/Scaffold'

const FunctionsPage: NextPageWithLayout = () => {
  const { meta } = useStore()
  const { project } = useProjectContext()
  const [selectedFunction, setSelectedFunction] = useState<any>()
  const [showCreateFunctionForm, setShowCreateFunctionForm] = useState<boolean>(false)
  const [showDeleteFunctionForm, setShowDeleteFunctionForm] = useState<boolean>(false)

  const canReadFunctions = useCheckPermissions(PermissionAction.TENANT_SQL_ADMIN_READ, 'functions')

  useEffect(() => {
    if (project?.ref) {
      fetchFunctions()
    }
  }, [project?.ref])

  const fetchFunctions = async () => {
    meta.functions.load()
  }

  const createFunction = () => {
    setSelectedFunction(undefined)
    setShowCreateFunctionForm(true)
  }

  const editFunction = (fn: any) => {
    setSelectedFunction(fn)
    setShowCreateFunctionForm(true)
  }

  const deleteFunction = (fn: any) => {
    setSelectedFunction(fn)
    setShowDeleteFunctionForm(true)
  }

  if (!canReadFunctions) {
    return <NoPermission isFullPage resourceText="view database functions" />
  }

  return (
    <>
      <ScaffoldContainer>
        <ScaffoldSection>
          <div className="col-span-12">
            <div className="mb-4">
              <h3 className="mb-1 text-xl text-scale-1200">Database Functions</h3>
            </div>
            <FunctionsList
              createFunction={createFunction}
              editFunction={editFunction}
              deleteFunction={deleteFunction}
            />
          </div>
        </ScaffoldSection>
      </ScaffoldContainer>
      <CreateFunction
        func={selectedFunction}
        visible={showCreateFunctionForm}
        setVisible={setShowCreateFunctionForm}
      />
      <DeleteFunction
        func={selectedFunction}
        visible={showDeleteFunctionForm}
        setVisible={setShowDeleteFunctionForm}
      />
    </>
  )
}

FunctionsPage.getLayout = (page) => <DatabaseLayout title="Database">{page}</DatabaseLayout>

export default observer(FunctionsPage)
