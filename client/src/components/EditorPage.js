import React, { useEffect, useRef, useState } from "react";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import CodeMirror from "codemirror";
import "codemirror/mode/python/python";
import "codemirror/mode/clike/clike";
import toast, { Toaster } from "react-hot-toast";
import { Play } from "lucide-react";
import { executeCode } from "./ExecuteCode";
import {
  LANGUAGE_VERSIONS,
  CODE_SNIPPETS,
  LANGUAGE_MODES,
} from "../constants/constant";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
} from "@mui/material";

function Editor({ onCodeChange }) {
  const editorRef = useRef(null);
  const textareaRef = useRef(null);
  const code = useRef("");
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [output, setOutput] = useState("Your code output comes here...");

  useEffect(() => {
    if (editorRef.current) {
      return;
    }

    async function init() {
      editorRef.current = CodeMirror.fromTextArea(textareaRef.current, {
        mode: { name: "javascript", json: true },
        theme: "dracula",
        autoCloseBrackets: true,
        autoCloseTags: true,
        autocorrect: true,
        lineNumbers: true,
      });

      editorRef.current.setSize("100%", "h-full");

      // Load user-specific code from local storage
      const savedCode = localStorage.getItem("userCode") || CODE_SNIPPETS[selectedLanguage];
      editorRef.current.setValue(savedCode);
      code.current = savedCode;

      editorRef.current.on("change", (instance) => {
        const currentCode = instance.getValue();
        code.current = currentCode;
        onCodeChange(currentCode);

        // Save user-specific code in local storage
        localStorage.setItem("userCode", currentCode);
      });
    }

    init();

    return () => {
      if (editorRef.current) {
        editorRef.current.toTextArea();
        editorRef.current = null;
      }
    };
  }, []);

  const handleExecuteCode = async () => {
    try {
      const result = await executeCode({
        language: selectedLanguage,
        sourceCode: code.current,
      });
      setOutput(result.run.output);
    } catch (error) {
      toast.error("Failed to execute code: " + error.message);
      setOutput(error.message);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectLanguage = (event) => {
    const language = event.target.value;
    setSelectedLanguage(language);

    const mode = LANGUAGE_MODES[language];
    if (mode) {
      editorRef.current.setOption("mode", mode);
      editorRef.current.setValue(CODE_SNIPPETS[language]);
      code.current = CODE_SNIPPETS[language];

      // Save selected language to local storage
      localStorage.setItem("selectedLanguage", language);
    }
  };

  return (
    <div className="h-full w-full">
      <Toaster />
      <textarea ref={textareaRef} className="h-full w-full" />

      <div className="flex justify-center items-center">
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#22c55e",
            marginTop: "4px",
            color: "black",
            border: "#22c55e",
            "&:hover": { backgroundColor: "#22c55f" },
          }}
          onClick={handleClickOpen}
        >
          {selectedLanguage || "Select Language"}
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Select a Language</DialogTitle>
          <DialogContent>
            <Select
              value={selectedLanguage}
              onChange={handleSelectLanguage}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>
                Select a language
              </MenuItem>
              {Object.keys(LANGUAGE_VERSIONS).map((language) => (
                <MenuItem key={language} value={language}>
                  {language}
                </MenuItem>
              ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
        <p className="text-Black font-bold m-2">Execute Code:</p>
        <Play
          onClick={handleExecuteCode}
          size={"2rem"}
          className="bg-green-500 border rounded-full p-1 "
        />
      </div>

      <p className="text-Black">Output:</p>
      <div className="w-full bg-gray-800 text-white p-2 my-4 h-36 overflow-y-hidden">
        <pre>{output}</pre>
      </div>
    </div>
  );
}

export default Editor;
