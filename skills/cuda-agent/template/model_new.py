import torch
import torch.nn as nn
import cuda_extension


class ModelNew(nn.Module):

    def __init__(self, alpha: float) -> None:
        super().__init__()
        self.alpha = alpha

    def forward(self, a, b):
        return cuda_extension.axpby_forward(a, b, self.alpha, 0)
