import { IconArrowUp } from "@tabler/icons-react";
import { useWindowScroll } from "@mantine/hooks";
import { Affix, Transition } from "@mantine/core";
import "@fontsource-variable/lexend";

function Scroll() {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <Affix position={{ bottom: 30, right: 30 }}>
      <Transition transition="slide-up" mounted={scroll.y > 0}>
        {(styles) => (
          <button
            style={styles}
            onClick={() => scrollTo({ y: 0 })}
            className="bg-[#177529] hover:bg-[#97C040] text-white font-[Lexend] p-3 rounded-full shadow-sm transition-transform hover:scale-105"
          >
            <IconArrowUp size={18} />
          </button>
        )}
      </Transition>
    </Affix>
  );
}

export default Scroll;
