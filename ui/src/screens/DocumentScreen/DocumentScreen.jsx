import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { fetchDocument } from 'src/actions';
import { selectEntity } from 'src/selectors';
import { Screen, Entity, Breadcrumbs, ScreenLoading, ErrorScreen, DualPane } from 'src/components/common';
import CaseContext from "src/components/Case/CaseContext";
import { DocumentContent, DocumentInfo } from '../../components/Document';


class DocumentScreen extends Component {
  componentDidMount() {
    const { documentId } = this.props;
    this.props.fetchDocument({ id: documentId });
  }

  componentDidUpdate(prevProps) {
    const { documentId } = this.props;
    if (documentId !== prevProps.documentId) {
      this.props.fetchDocument({ id: documentId });
    }
  }

  render() {
    const { document } = this.props;
    if (document.isError) {
      return <ErrorScreen error={document.error} />;
    }
    if (document === undefined || document.id === undefined) {
      return <ScreenLoading />;
    }

    const breadcrumbs = (
      <Breadcrumbs collection={document.collection}>
        { document.parent && (
          <li>
            <Entity.Link entity={document.parent} className="pt-breadcrumb" icon truncate={30} />
          </li>
        )}
        <li>
          <Entity.Link entity={document} className="pt-breadcrumb" icon truncate={30} />
        </li>
      </Breadcrumbs>
    );

    return (
      <Screen breadcrumbs={breadcrumbs} title={document.title || document.file_name}>
        <CaseContext collection={document.collection} activeTab="Documents">
          <DualPane>
            <DocumentContent document={document} />
            <DocumentInfo document={document} />
          </DualPane>
        </CaseContext>
      </Screen>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { documentId } = ownProps.match.params;
  return { documentId, document: selectEntity(state, documentId) };
};

DocumentScreen = connect(mapStateToProps, { fetchDocument }, null, { pure: false })(DocumentScreen);
DocumentScreen = injectIntl(DocumentScreen);
export default DocumentScreen
