const containerBackground = 'bg-gradient-to-br from-[#f5f7fa] via-[#e3ecf5] to-[#f0f4f8]'

export const styles = {
  container: `w-full h-full py-6 pt-20 sm:pt-30 rounded-[4px] ${containerBackground} flex flex-col items-center gap-4 `,
  header: 'bg-white/80 backdrop-blur-sm border border-[#e3e8f0] rounded-[16px] shadow-xl p-4 sm:p-10 w-[360px] sm:w-[760px]',
  contentNoFull: 'bg-white/80 backdrop-blur-sm border border-[#e3e8f0] rounded-[16px] shadow-xl p-10 max-w-[360px] sm:max-w-[1200px] flex flex-col items-center w-fit',
  content: 'bg-white/80 backdrop-blur-sm border border-[#e3e8f0] rounded-[16px] shadow-xl p-6 sm:p-10 max-w-[360px] sm:max-w-[1200px]  flex flex-col items-center w-full',

  tab: 'flex flex-col items-center w-[200px] mb-2 mt-1',
  tabDescription: 'text-xl font-semibold mb-2 text-center ',
  tabBoxContent: 'flex items-center gap-1 mt-1',

  columns: 'flex flex-col items-center w-full sm:mt-2',
  columnsNoGap: 'flex flex-col items-center w-full',
  columnsNoGapNoWidth: 'flex flex-col items-center',
  row: 'flex flex-row items-center w-full mt-2',
  rowNoGap: 'flex flex-row items-center w-full',
  rowNoGapNoWidth: 'flex flex-row items-center',

  PdfViewer:
    'bg-gradient-to-br from-[#fdfdfe] to-[#f6f8fb] shadow-lg p-4 sm:p-8 sm:mx-auto max-w-[1150px] min-w-[375px] flex flex-col items-center border border-[#e3e8f0] rounded-lg',
  typography: 'text-lg font-semibold text-primary mb-2',
  h2: 'pb-2 text-2xl font-semibold tracking-tight first:mt-0 text-primary',
  h3: 'scroll-m-20 text-xl font-semibold tracking-tight mt-3 text-primary',
  p: 'leading-6 mt-1',
}
