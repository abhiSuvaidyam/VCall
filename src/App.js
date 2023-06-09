import { useEffect, useRef, useState } from 'react';
import './App.css';
import Peer from 'peerjs';

function App() {

  const [peerId, setpeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null)
  const peerInstance = useRef(null);

  useEffect(() => {
    const peer = new Peer()
    peer.on('open', (id) => {
      setpeerId(id)
    });

    peer.on('call', (call) => {
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.moxGetUserMedia || navigator.msGetUserMedia;


      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play()
        call.answer(mediaStream)
        call.on('stream', function (remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream
          remoteVideoRef.current.play();
        });

      });
    });

    peerInstance.current = peer;
  }, [])

  const call = (remotePeerId) => {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {

      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream)

      call.on('stream', (remoteStream) => {
        // Show stream in some video/canvas element
        remoteVideoRef.current.srcObject = remoteStream
        remoteVideoRef.current.play();
      });
    });
  }

  console.log(peerId)

  return (
    <>
      <div className="App">
        <p>Current user id is = {peerId}</p>
        <input type='text' value={remotePeerIdValue} onChange={e => { setRemotePeerIdValue(e.target.value) }} id="" />
        <button onClick={() => call(remotePeerIdValue)}>Call</button>
        <div><video ref={currentUserVideoRef} /></div>
        <div><video ref={remoteVideoRef} /></div>
      </div>
    </>
  );
}

export default App;
