async function sendLog({ fileName, functionName, type, log }) {
  const message = {
    type,
    where: `${fileName} > ${functionName}`,
    log,
  };
  console[type](message);

  try {
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName,
        functionName,
        type,
        log,
      }),
    };
    await fetch("/api/send-log", request);
  } catch (e) {
    console.error(e);
  }
}

export { sendLog };
