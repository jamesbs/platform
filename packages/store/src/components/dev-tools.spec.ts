import { NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DevToolsExtension } from './dev-tools';
import { NgRedux } from './ng-redux';
import { RootStore } from './root-store';

type MockWindowDevTools = jest.Mock & {
  listen: any;
};

interface WindowDevToolsExtended {
  devToolsExtension: MockWindowDevTools;
}

describe('DevToolsExtension', () => {
  const extensionMock: MockWindowDevTools = jest.fn() as any;
  extensionMock.listen = jest.fn();

  beforeEach(() => {
    (window as any).devToolsExtension = extensionMock;

    TestBed.configureTestingModule({
      providers: [
        DevToolsExtension,
        {
          provide: NgRedux,
          useFactory: (ngZone: NgZone) => new RootStore(ngZone),
          deps: [NgZone],
        },
      ],
    });
  });

  describe('isEnabled', () => {
    it('is enabled when the devTools extension is installed', () => {
      const extension = TestBed.get(DevToolsExtension);
      const isEnabled = extension.isEnabled();

      expect(isEnabled).toBe(extensionMock);
    });

    it("is not enabled when the devTools extension doesn't exist", () => {
      delete (window as any).devToolsExtension;
      const extension = TestBed.get(DevToolsExtension);

      expect(extension.isEnabled()).toBe(undefined);
    });

    it("doesn't provide an enhancer when the extension is not installed", () => {
      delete (window as any).devToolsExtension;
      const extension = TestBed.get(DevToolsExtension);

      expect(extension.enhancer()).toBe(null);
    });
  });

  describe('enhancer', () => {
    it('calls the devTools enhancer if the extension is installed', () => {
      const extension = TestBed.get(DevToolsExtension);
      const windowDevTools = ((window as any) as WindowDevToolsExtended)
        .devToolsExtension;
      windowDevTools.mockReturnValue('matches');
      const enhancer = extension.enhancer();

      expect(windowDevTools).toHaveBeenCalledWith(undefined);
      expect(enhancer).toBe('matches');
    });

    it('pass enhancer options through', () => {
      const options = { name: 'redux devtools manual config' };
      const extension = TestBed.get(DevToolsExtension);
      const windowDevTools = ((window as any) as WindowDevToolsExtended)
        .devToolsExtension;
      windowDevTools.mockReturnValue('matches');
      const enhancer = extension.enhancer(options);

      expect(windowDevTools).toHaveBeenCalledWith(options);
      expect(enhancer).toBe('matches');
    });
  });
});
