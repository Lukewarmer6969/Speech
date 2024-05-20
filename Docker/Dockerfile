FROM pytorch/pytorch:2.1.0-cuda11.8-cudnn8-runtime AS builder

WORKDIR /app

COPY . /app

RUN pip install flask transformers numpy scipy

FROM builder AS runtime

WORKDIR /app

COPY --from=builder /app /app

CMD ["python", "app.py"]
