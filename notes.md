

# Ticket 4: 
- needed to make 2 changes to fix request id: 1, add winston formatter that reads from the logger's requestId to the logger constructor. 2, change buildHeaders to build headers during parse stage so that the requestId is available in the context in the execution stage.