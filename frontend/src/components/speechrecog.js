import React, { Component } from "react";
import PropTypes from "prop-types";
import SpeechRecognition from "react-speech-recognition";

const propTypes = {
  // Props injected by SpeechRecognition
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool,
  recognition: PropTypes.object,
};

const Dictaphone = ({
  transcript,
  resetTranscript,
  browserSupportsSpeechRecognition,
  recognition,
}) => {
    recognition.lang = 'ja-JP'
  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div>
      <button onClick={resetTranscript}>Reset</button>
      <span>{transcript}</span>
    </div>
  );
};

Dictaphone.propTypes = propTypes;

// DictaphonebrowserSupportsSpeechRecognition.lang = 'ja-JP'
export default SpeechRecognition(Dictaphone);