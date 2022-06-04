import React, { useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs'
import { useEffect } from 'react'


export default function NewsEditor(props) {
    const [editorState, seteditorState] = useState('')
    useEffect(() => {
        // console.log(props.content);
        const html = props.content;
        // 这里有一个问题就是 我的newsadd和newsupdate都用了同一个模块 但是newsadd是没有content这个属性的
        // 因此需要判断html 
        if(html === undefined) return;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            seteditorState(editorState)
        }
    }, [props.content])
    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={editorState => seteditorState(editorState)}
                onBlur={() => {
                    // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
            />
        </div>
    )
}
