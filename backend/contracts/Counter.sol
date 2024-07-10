// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library Counter {
    struct CounterStruct {
        uint256 _value; // This is the current value of the counter
    }

    function increment(CounterStruct storage self) internal {
        unchecked {
            self._value += 1;
        }
    }

    function decrement(CounterStruct storage self) internal {
        unchecked {
            self._value -= 1;
        }
    }

    function current(CounterStruct storage self) internal view returns (uint256) {
        return self._value;
    }
}
