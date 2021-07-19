import styled from "styled-components";
import ReactMarkdown, { propTypes } from "react-markdown";
import gfm from "remark-gfm";
import PropTypes from "prop-types";

const BodyTextarea = styled.textarea`
  background: none;
  border: 1px solid #777;
  border-radius: 3px;
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  min-height: 200px;
  margin-bottom: 20px;
  color: #fff;
  font-family: inherit;
`;

const PreviewArea = styled.div`
  padding: 10px 20px;
  background: #444;
  border-radius: 5px;
  margin-bottom: 20px;
`;

export default function PostBodyTextArea(props) {
  return (
    <>
      <BodyTextarea
        value={props.value}
        onChange={(e) => props.handlePostBodyChange(e.target.value)}
        placeholder={props.placeholder}
      />
      {!!props.value && props.value.length > 0 && (
        <PreviewArea>
          <ReactMarkdown remarkPlugins={[gfm]} children={props.value} />
        </PreviewArea>
      )}
    </>
  );
}
PostBodyTextArea.propTypes = {
  value: PropTypes.string.isRequired,
  handlePostBodyChange: PropTypes.any,
  placeholder: PropTypes.string.isRequired,
};
