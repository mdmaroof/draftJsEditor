import { useState, useCallback } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  convertFromRaw,
  convertToRaw,
} from "draft-js";

const App = () => {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      const contentState = convertFromRaw(JSON.parse(savedContent));
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
  });

  const saveData = () => {
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    localStorage.setItem("editorContent", JSON.stringify(rawContentState));
  };

  const handleBeforeInput = (chars) => {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const block = contentState.getBlockForKey(selection.getStartKey());
    const text = block.getText();
    const endOffset = selection.getEndOffset();

    if (chars === " " && text[text.length - 1] === "#") {
      headingOne(editorState, selection, endOffset);
      return "handled";
    }
    if (
      chars === " " &&
      text[text.length - 1] === "*" &&
      text[text.length - 2] !== "*"
    ) {
      activateBoldCommand(editorState, selection, endOffset);
      return "handled";
    }
    if (
      chars === " " &&
      text[text.length - 1] === "*" &&
      text[text.length - 2] === "*" &&
      text[text.length - 3] !== "*"
    ) {
      redColor(editorState, selection, endOffset);
      return "handled";
    }
    if (
      chars === " " &&
      text[text.length - 1] === "*" &&
      text[text.length - 2] === "*" &&
      text[text.length - 3] === "*"
    ) {
      underline(editorState, selection, endOffset);
      return "handled";
    }

    if (
      chars === " " &&
      text[text.length - 1] === "`" &&
      text[text.length - 2] === "`" &&
      text[text.length - 3] === "`"
    ) {
      highlight(editorState, selection, endOffset);
      return "handled";
    }

    return "not-handled";
  };

  const headingOne = useCallback((editorState, selection, endOffset) => {
    const contentState = editorState.getCurrentContent();
    let newContentState = contentState;

    const targetRange = selection.merge({
      anchorOffset: endOffset - 1,
      focusOffset: endOffset,
    });
    newContentState = Modifier.removeRange(
      newContentState,
      targetRange,
      "backward"
    );

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "change-inline-style"
    );
    setEditorState(RichUtils.toggleInlineStyle(newEditorState, "HEADING_ONE"));
  }, []);

  const underline = useCallback((editorState, selection, endOffset) => {
    const contentState = editorState.getCurrentContent();
    let newContentState = contentState;

    const targetRange = selection.merge({
      anchorOffset: endOffset - 3,
      focusOffset: endOffset,
    });
    newContentState = Modifier.removeRange(
      newContentState,
      targetRange,
      "backward"
    );

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "change-inline-style"
    );
    setEditorState(RichUtils.toggleInlineStyle(newEditorState, "UNDERLINE"));
  }, []);

  const redColor = useCallback((editorState, selection, endOffset) => {
    const contentState = editorState.getCurrentContent();
    let newContentState = contentState;

    const targetRange = selection.merge({
      anchorOffset: endOffset - 2,
      focusOffset: endOffset,
    });
    newContentState = Modifier.removeRange(
      newContentState,
      targetRange,
      "backward"
    );

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "change-inline-style"
    );
    setEditorState(RichUtils.toggleInlineStyle(newEditorState, "RED_COLOR"));
  }, []);

  const activateBoldCommand = useCallback(
    (editorState, selection, endOffset) => {
      const contentState = editorState.getCurrentContent();
      let newContentState = contentState;

      const targetRange = selection.merge({
        anchorOffset: endOffset - 1,
        focusOffset: endOffset,
      });
      newContentState = Modifier.removeRange(
        newContentState,
        targetRange,
        "backward"
      );

      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "change-inline-style"
      );
      setEditorState(RichUtils.toggleInlineStyle(newEditorState, "BOLD"));
    },
    []
  );

  const highlight = useCallback((editorState, selection, endOffset) => {
    const contentState = editorState.getCurrentContent();
    let newContentState = contentState;

    const targetRange = selection.merge({
      anchorOffset: endOffset - 3,
      focusOffset: endOffset,
    });
    newContentState = Modifier.removeRange(
      newContentState,
      targetRange,
      "backward"
    );

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "change-inline-style"
    );
    setEditorState(RichUtils.toggleInlineStyle(newEditorState, "HIGHLIGHTED"));
  }, []);

  const customStyleMap = {
    RED_COLOR: {
      color: "red",
    },
    HEADING_ONE: {
      fontSize: "30px",
      fontWeight: "700",
    },
    HIGHLIGHTED: {
      background: "#000",
      color: "#fff",
      padding: "0.25em",
      borderRadius: "4px",
    },
  };

  return (
    <div className="flex w-600">
      <h4>Demo Editor by Mohd Maroof</h4>
      <Editor
        editorState={editorState}
        onChange={(editorState) => setEditorState(editorState)}
        handleBeforeInput={handleBeforeInput}
        customStyleMap={customStyleMap}
      />
      <button onClick={() => saveData()} className="btn">
        Save
      </button>
    </div>
  );
};

export default App;
