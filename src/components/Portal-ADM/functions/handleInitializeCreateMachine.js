


export const handleInitializeCreateMachine = (refCreateSession, setCurrentNanoID, generateCustomID) => {
  refCreateSession.current.style.display = 'flex'
  setCurrentNanoID(generateCustomID(7))
}