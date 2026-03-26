import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { renderHook } from '@root/test.utils';

describe('useInfiniteScroll', () => {
  let observeMock;
  let disconnectMock;

  beforeEach(() => {
    observeMock = jest.fn();
    disconnectMock = jest.fn();
    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: observeMock,
      disconnect: disconnectMock,
      unobserve: jest.fn()
    }));
  });

  it('should call observe when mounted', () => {
    const bodyRef = { current: document.createElement('div') };
    const bottomLineRef = { current: document.createElement('div') };
    const callback = jest.fn();
    renderHook(() => useInfiniteScroll(bodyRef, bottomLineRef, callback));
    expect(observeMock).toHaveBeenCalledTimes(1);
    expect(observeMock).toHaveBeenCalledWith(bottomLineRef.current);
  });

  it('should call disconnect when unmounted', () => {
    const bodyRef = { current: document.createElement('div') };
    const bottomLineRef = { current: document.createElement('div') };
    const callback = jest.fn();
    const { unmount } = renderHook(() => useInfiniteScroll(bodyRef, bottomLineRef, callback));
    expect(observeMock).toHaveBeenCalledTimes(1);
    unmount();
    expect(disconnectMock).toHaveBeenCalledTimes(1);
  });
});
