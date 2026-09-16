{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "lineage-static",
      "runtimeExecutable": "python3",
      "runtimeArgs": ["-m", "http.server", "8642", "--bind", "127.0.0.1"],
      "port": 8642
    },
    {
      "name": "sujok-calendar",
      "runtimeExecutable": "python3",
      "runtimeArgs": ["-m", "http.server", "8643", "--bind", "127.0.0.1", "--directory", "sujok-calendar"],
      "port": 8643
    }
  ]
}
