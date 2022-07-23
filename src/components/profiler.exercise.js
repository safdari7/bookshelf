import React from 'react'
import {client} from 'utils/api-client'

let queue = []

setInterval(sendProfileQueue, 5000)

function sendProfileQueue() {
  if (queue.length === 0) {
    return Promise.resolve({success: true})
  }
  const queueToSend = [...queue]
  queue = []
  return client('profile', {data: queueToSend})
}

export function Profiler({phases , metaData, ...props}) {
  function reportProfile(
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions,
  ) {
    if (!phases || phases.includes(phase)) {
      queue.push({
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
        metaData
      })
    }
  }

  return <React.Profiler onRender={reportProfile} {...props} />
}
